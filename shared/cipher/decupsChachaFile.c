#include <node_api.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <wolfssl/options.h>
#include <wolfssl/wolfcrypt/chacha20_poly1305.h>
#include <wolfssl/wolfcrypt/random.h>

napi_value EncryptFile(napi_env env, napi_callback_info info)
{
    napi_status status;
    // Получение аргументов из JavaScript
    size_t argc = 3;
    napi_value argv[3];
    status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
    if (status != napi_ok || argc != 3)
    {
        napi_throw_error(env, NULL, "Ожидались три аргумента.");
        return NULL;
    }
    // Чтение пути к исходному файлу
    size_t srcPathLength;
    char srcPath[1024];
    status = napi_get_value_string_utf8(env, argv[0], srcPath, 1024, &srcPathLength);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при чтении пути к исходному файлу.");
        return NULL;
    }
    // Чтение пути к зашифрованному файлу
    size_t destPathLength;
    char destPath[1024];
    status = napi_get_value_string_utf8(env, argv[1], destPath, 1024, &destPathLength);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при чтении пути к зашифрованному файлу.");
        return NULL;
    }
    // Чтение shared secret
    size_t sharedSecretLength;
    unsigned char *sharedSecretData;
    status = napi_get_buffer_info(env, argv[2], (void **)&sharedSecretData, &sharedSecretLength);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при чтении shared secret.");
        return NULL;
    }
    // Открытие исходного файла для чтения
    FILE *srcFile = fopen(srcPath, "rb");
    if (srcFile == NULL)
    {
        napi_throw_error(env, NULL, "Ошибка при открытии исходного файла.");
        return NULL;
    }
    // Определение размера файла
    fseek(srcFile, 0, SEEK_END);
    long fileSize = ftell(srcFile);
    fseek(srcFile, 0, SEEK_SET);
    // Чтение содержимого файла
    unsigned char *fileData = (unsigned char *)malloc(fileSize);
    if (fileData == NULL)
    {
        fclose(srcFile);
        napi_throw_error(env, NULL, "Ошибка при выделении памяти для файла.");
        return NULL;
    }
    size_t readBytes = fread(fileData, 1, fileSize, srcFile);
    if (readBytes < fileSize)
    {
        free(fileData);
        fclose(srcFile);
        napi_throw_error(env, NULL, "Ошибка при чтении файла.");
        return NULL;
    }
    fclose(srcFile);
    // Инициализация параметров шифрования
    byte block[12];
    WC_RNG rng;
    if (wc_InitRng(&rng) != 0 || wc_RNG_GenerateBlock(&rng, block, sizeof(block)) != 0)
    {
        free(fileData);
        napi_throw_error(env, NULL, "Ошибка при генерации блока (IV).");
        return NULL;
    }
    wc_FreeRng(&rng);
    byte authTag[16];
    byte *cipherText = (byte *)malloc(fileSize + 16); // Дополнительное место для Auth Tag
    if (cipherText == NULL)
    {
        free(fileData);
        napi_throw_error(env, NULL, "Ошибка при выделении памяти для зашифрованного текста.");
        return NULL;
    }
    // Шифрование
    if (wc_ChaCha20Poly1305_Encrypt(sharedSecretData, block, NULL, 0, fileData, fileSize, cipherText, authTag) != 0)
    {
        free(fileData);
        free(cipherText);
        napi_throw_error(env, NULL, "Ошибка при шифровании файла.");
        return NULL;
    }
    // Запись зашифрованных данных в файл
    FILE *destFile = fopen(destPath, "wb");
    if (destFile == NULL)
    {
        free(fileData);
        free(cipherText);
        napi_throw_error(env, NULL, "Ошибка при открытии файла для записи.");
        return NULL;
    }
    fwrite(cipherText, 1, fileSize, destFile);
    fwrite(authTag, 1, 16, destFile); // Дописываем Auth Tag в конец файла
    fclose(destFile);
    // Создание объекта для возврата в JavaScript
    napi_value resultObject, blockBuffer, authTagBuffer;
    status = napi_create_object(env, &resultObject);
    if (status != napi_ok)
    {
        free(fileData);
        free(cipherText);
        napi_throw_error(env, NULL, "Ошибка при создании объекта для результата.");
        return NULL;
    }
    // Создание буфера для Block (IV)
    status = napi_create_buffer_copy(env, sizeof(block), block, NULL, &blockBuffer);
    if (status != napi_ok)
    {
        free(fileData);
        free(cipherText);
        napi_throw_error(env, NULL, "Ошибка при создании буфера для Block (IV).");
        return NULL;
    }
    // Создание буфера для Auth Tag
    status = napi_create_buffer_copy(env, sizeof(authTag), authTag, NULL, &authTagBuffer);
    if (status != napi_ok)
    {
        free(fileData);
        free(cipherText);
        napi_throw_error(env, NULL, "Ошибка при создании буфера для Auth Tag.");
        return NULL;
    }
    // Установка свойств объекта resultObject
    status = napi_set_named_property(env, resultObject, "block", blockBuffer);
    if (status != napi_ok)
    {
        free(fileData);
        free(cipherText);
        napi_throw_error(env, NULL, "Ошибка при установке свойства 'block'.");
        return NULL;
    }
    status = napi_set_named_property(env, resultObject, "authTag", authTagBuffer);
    if (status != napi_ok)
    {
        free(fileData);
        free(cipherText);
        napi_throw_error(env, NULL, "Ошибка при установке свойства 'authTag'.");
        return NULL;
    }
    // Очистка и возврат
    free(fileData);
    free(cipherText);
    return resultObject;
}

napi_value Init(napi_env env, napi_value exports)
{
    napi_status status;
    napi_value fn;
    status = napi_create_function(env, NULL, 0, EncryptFile, NULL, &fn);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании функции");
        return NULL;
    }
    status = napi_set_named_property(env, exports, "EncryptFile", fn);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при установке функции");
        return NULL;
    }
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)

